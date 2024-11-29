'use client'

import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  label?: string
  options: Option[]
  placeholder?: string
}

export function FormSelect({
  name,
  label,
  options,
  placeholder,
  className,
  ...props
}: FormSelectProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500',
          className
        )}
        {...register(name)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">
          {error.message?.toString()}
        </p>
      )}
    </div>
  )
}
