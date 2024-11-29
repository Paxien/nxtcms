import { ContactForm } from '@/components/forms/ContactForm'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team',
}

export default function ContactPage() {
  return (
    <main className="container mx-auto py-12">
      <ContactForm />
    </main>
  )
}
