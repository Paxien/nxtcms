'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form'
import { z } from 'zod'

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  children: React.ReactNode
  className?: string
}

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          {children}
        </fieldset>
      </form>
    </FormProvider>
  )
}

interface UseZodFormProps<T extends z.ZodType>
  extends Omit<UseFormProps<z.infer<T>>, 'resolver'> {
  schema: T
}

export function useZodForm<T extends z.ZodType>({
  schema,
  ...formProps
}: UseZodFormProps<T>) {
  return useForm({
    ...formProps,
    resolver: zodResolver(schema),
  })
}
