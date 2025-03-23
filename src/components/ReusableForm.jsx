import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "bootstrap/dist/css/bootstrap.min.css";

const ReusableForm = ({ fields, validationSchema, onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset(); // Reset form after submission
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 border rounded bg-light">
            {fields.map(({ name, label, type, placeholder, accept }, index) => (
                <div className="mb-3" key={index}>
                    <label className="form-label">{label}</label>
                    {type === "textarea" ? (
                        <textarea {...register(name)} className="form-control" placeholder={placeholder} />
                    ) : (
                        <input {...register(name)} type={type} className="form-control" placeholder={placeholder} accept={accept} />
                    )}
                    <p className="text-danger">{errors[name]?.message}</p>
                </div>
            ))}
            <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
    );
};

export default ReusableForm;
