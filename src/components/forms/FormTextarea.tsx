'use client'

import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
}

export function FormTextarea({
  name,
  label,
  className,
  ...props
}: FormTextareaProps) {
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
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500',
          className
        )}
        {...register(name)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">
          {error.message?.toString()}
        </p>
      )}
    </div>
  )
}