import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "bootstrap/dist/css/bootstrap.min.css";

const ReusableForm = ({ fields, validationSchema, onSubmit, defaultValues }) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isDirty }, 
        reset,
        control 
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues || {} 
    });

    // Only reset when defaultValues changes AND form hasn't been modified
    useEffect(() => {
        if (!isDirty) {
            reset(defaultValues || {});
        }
    }, [defaultValues, reset, isDirty]);

    const handleFormSubmit = (data) => {
        console.log("Form submitted with data:", data);
        
        onSubmit(data);
    };
    
    
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 border rounded bg-light">
            {fields.map(({ name, label, type, placeholder, accept, options }, index) => (
                <div className="mb-3" key={index}>
                    <label className="form-label">{label}</label>
                    
                    {type === "textarea" ? (
                        <textarea 
                            {...register(name)} 
                            className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                            placeholder={placeholder}
                        />
                    ) : type === "select" ? (
                        <select 
                            {...register(name)} 
                            className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                        >
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input 
                            {...register(name)} 
                            type={type} 
                            className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                            placeholder={placeholder} 
                            accept={accept}
                        />
                    )}
                    {errors[name] && (
                        <div className="invalid-feedback">
                            {errors[name]?.message}
                        </div>
                    )}
                </div>
            ))}
            <button type="submit" className="btn btn-primary w-100">
                Submit
            </button>
        </form>
    );
};

export default ReusableForm;