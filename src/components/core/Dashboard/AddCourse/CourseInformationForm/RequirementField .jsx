import React, { useEffect, useState } from 'react'

const RequirementField = ({name, label, errors, register, setValue, getValue}) => {

    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);

    useEffect(() => {
        register(name, {
            reuired:true,
            validate: (value) => value.length > 0
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        setValue(name, requirementList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [requirementList])

    const handleAddRequirement = () => {
        if(requirement){
            setRequirementList([...requirementList, requirement]);
            setRequirement("");
        }
    }

    const handleremoveRequirement = (index) => {
        const updateRequirementList = [...requirementList];
        updateRequirementList.splice(index, 1);
        setRequirementList(updateRequirementList);
    }

    return(
        <div className="flex flex-col space-y-2">

            <label className="text-sm text-richblack-5"  htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>
            <div className="flex flex-col items-start space-y-2">
                <input type="text" 
                 id={name}
                 value={requirement}
                 onChange={(e) => setRequirement(e.target.value)}
                 className='form-style w-full'
                />
                <button type='button'
                  onClick={handleAddRequirement}
                  className='font-semibold text-yellow-50'
                >
                    Add
                </button>
            </div>

            {
                requirementList.length > 0 && (
                    <ul className="mt-2 list-inside list-disc">
                        {
                            requirementList.map((requirement, index) => (
                                <li key={index} className='flex items-center text-richblack-5'>
                                    <span>{requirement}</span>
                                    <button type='button' 
                                    onClick={() => handleremoveRequirement(index)}
                                    className='text-xs text-pure-greys-300 '
                                    >
                                        Clear
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
            {
                errors[name] && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">{label} is required</span>
                )
            }

        </div>

    )
}

export default RequirementField 