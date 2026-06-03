import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import { submitContactForm } from '../../api/contact';
import type { ContactFormData } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
  message: z.string().min(20, 'Please provide more detail (min 20 characters)'),
  honeypot: z.string().optional(),
});

const contactInfo = [
  {
    icon: MapPin,
    label: 'Office Address',
    value: '12th Floor, Tower B, DLF Cyber City, Gurugram, Haryana – 122002',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 114 000 1000',
    href: 'tel:+911140001000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'procurement@prosource.com',
    href: 'mailto:procurement@prosource.com',
  },
];

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData & { honeypot?: string }>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactFormData & { honeypot?: string }) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitContactForm(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-pad bg-[#FFFAEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Get In Touch"
          title="Request a Procurement Quote"
          subtitle="Fill in your requirements and our team will respond with a tailored proposal within 24 business hours."
          className="mb-14"
        />

        <div ref={ref} className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Contact Info — left */}
          <div
            className={cn(
              'lg:col-span-2 transition-all duration-600',
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            )}
          >
            <div className="space-y-6 mb-8">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-sm bg-[#578E7E]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#578E7E]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider mb-1">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-[#3D3D3D] hover:text-[#578E7E] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-[#3D3D3D] leading-relaxed">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="p-5 bg-white rounded-sm border border-[#F5ECD5]">
              <h4 className="font-semibold text-[#3D3D3D] text-sm mb-3">Business Hours</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a7a7a]">Monday – Friday</span>
                  <span className="text-[#3D3D3D] font-medium">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a7a7a]">Saturday</span>
                  <span className="text-[#3D3D3D] font-medium">10:00 AM – 2:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a7a7a]">Sunday</span>
                  <span className="text-[#8a8a8a]">Closed</span>
                </div>
              </div>
            </div>

            {/* Response SLA */}
            <div className="mt-4 p-4 bg-[#578E7E]/10 rounded-sm border border-[#578E7E]/20">
              <div className="flex gap-3 items-start">
                <CheckCircle2 size={16} className="text-[#578E7E] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#5a5a5a] leading-relaxed">
                  We commit to responding to all procurement enquiries within{' '}
                  <strong className="text-[#578E7E]">4 business hours</strong>. For urgent requirements,
                  call us directly.
                </p>
              </div>
            </div>
          </div>

          {/* Form — right */}
          <div
            className={cn(
              'lg:col-span-3 transition-all duration-600 delay-150',
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
          >
            <div className="bg-white rounded-sm border border-[#F5ECD5] p-7 md:p-9 shadow-sm">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-[#578E7E]/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={32} className="text-[#578E7E]" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-[#3D3D3D] mb-3"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Enquiry Received!
                  </h3>
                  <p className="text-[#5a5a5a] text-sm max-w-sm mx-auto mb-6">
                    Thank you for reaching out. Our procurement team will review your requirements
                    and respond within 4 business hours with a tailored proposal.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Submit Another Enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    aria-hidden="true"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                    {...register('honeypot')}
                  />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="Rajesh Kumar"
                      required
                      {...register('name')}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Company Name"
                      placeholder="Acme Corp Pvt. Ltd."
                      required
                      {...register('company')}
                      error={errors.company?.message}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Business Email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      {...register('email')}
                      error={errors.email?.message}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      {...register('phone')}
                      error={errors.phone?.message}
                    />
                  </div>
                  <Textarea
                    label="Procurement Requirement"
                    placeholder="Describe the products you need, estimated quantity, delivery location, and any specific requirements..."
                    rows={5}
                    required
                    {...register('message')}
                    error={errors.message?.message}
                  />

                  {/* API submit error */}
                  {submitError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-600">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-[#8a8a8a]">
                      Your data is secure and never shared with third parties.
                    </p>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={submitting}
                      className="gap-2"
                    >
                      <Send size={14} />
                      Send Enquiry
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
