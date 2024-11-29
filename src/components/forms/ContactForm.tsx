'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact'
import { Form } from './Form'
import { FormField } from './FormField'
import { FormSelect } from './FormSelect'
import { FormTextarea } from './FormTextarea'

const departmentOptions = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Technical Support', value: 'support' },
  { label: 'Sales', value: 'sales' },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      department: 'general',
    },
  })

  async function onSubmit(data: ContactFormData) {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit form')
      }

      setSubmitSuccess(true)
      form.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      {submitSuccess ? (
        <div className="bg-green-50 text-green-900 rounded-lg p-4 mb-6">
          Thank you for your message. We'll get back to you soon!
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-6">
          <FormField
            name="name"
            label="Name"
            placeholder="Your name"
            disabled={isSubmitting}
          />
          
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          
          <FormSelect
            name="department"
            label="Department"
            options={departmentOptions}
            disabled={isSubmitting}
          />
          
          <FormField
            name="subject"
            label="Subject"
            placeholder="Brief subject of your message"
            disabled={isSubmitting}
          />
          
          <FormTextarea
            name="message"
            label="Message"
            placeholder="Your message..."
            disabled={isSubmitting}
          />
          
          {submitError && (
            <div className="bg-red-50 text-red-900 rounded-lg p-4">
              {submitError}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </Form>
      )}
    </div>
  )
}
