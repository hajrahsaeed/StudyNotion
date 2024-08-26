const Course = require("../models/Course");
const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail_templates/courseEnrollmentEmail");
const CourseProgress = require("../models/CourseProgress");
const { paymentSuccessEmail } = require("../mail_templates/paymentSuccessEmail");
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("Stripe Secret Key:", stripe);

// Initiate the Stripe payment
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({ success: false, message: "Please provide Course Id" });
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(200).json({ success: false, message: "Could not find the course" });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      console.log("UID -> ",uid);
      
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({ success: false, message: "Student is already Enrolled" });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  try {
    console.log("Creating Stripe session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: await Promise.all(courses.map(async (course_id) => {
        const course = await Course.findById(course_id); // Fetch course details from database
        
        if (!course) {
          throw new Error("Course not found");
        }
        return {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: course.courseName, // Replace with actual course name
              description:course.courseDescription, // Replace with actual course description
              images: [course.thumbnail], // Replace with actual thumbnail URL
            },
            unit_amount:course.price * 100,
          },
          quantity: 1,
        };
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/enrolled-courses?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId,
        courses: JSON.stringify(courses),
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
    });

    console.log("Stripe Session Data:", {
      payment_method_types: ['card'],
      line_items: await Promise.all(courses.map(async (course_id) => {
        const course = await Course.findById(course_id);
        return {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: course.courseName,
              description: course.courseDescription,
              images: [course.thumbnail],
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        };
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId,
        courses: JSON.stringify(courses),
      },
    });
    

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Could not Initiate Order" });
  }
};

// Verify the payment
exports.verifyPayment = async (req, res) => {
  const session_id = req.body.session_id;
  const userId = req.user.id;

  if (!session_id || !userId) {
    return res.status(400).json({ success: false, message: "Payment Failed" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const courses = JSON.parse(session.metadata.courses);
      await enrollStudents(courses, userId, res);
      return res.status(200).json({ success: true, message: "Payment Verified" });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};


// Enroll students after payment verification
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({ success: false, message: "Please Provide Course ID and User ID" });
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        {_id: courseId},
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({ success: false, message: "Course not found" });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      if (enrolledStudent) {
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
        );

        console.log("Email Sent Successfully", emailResponse.response);
      }
    
    return res.status(200).json({ success: true, message: "Students enrolled successfully" });
    } catch (error) {
      console.log("Error enrolling student:",error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user.id;

  if (!sessionId || !userId) {
    return res.status(400).json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        session.amount_total / 100,
        session.id,
        session.payment_intent
      )
    );

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log("error in sending mail", error);
    return res.status(500).json({ success: false, message: "Could not send email" });
  }
};

    
  