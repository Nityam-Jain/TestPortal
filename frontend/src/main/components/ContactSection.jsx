import React from 'react'

function ContactSection() {
  return (
    <>
    
       
  <section
  className="w-full py-16 px-4 md:px-10"
  id="contact"
  style={{
background: "linear-gradient(135deg, #F9F4EF 0%, #D2C1d6 30%, #456882 65%, #1B3C53 100%)",
    backgroundSize: "200%",
    animation: "gradientShift 10s ease infinite",
  }}
>
  <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8 md:p-12">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B3C53] mb-4">
      Get in Touch
    </h2>
    <p className="text-center text-gray-600 mb-8">
      We'd love to hear from you! Fill out the form and we'll get back to you as soon as possible.
    </p>

    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          rows="5"
          placeholder="Your message..."
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-[#1B3C53] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#163242] transition duration-300"
        >
          Send Message
        </button>
      </div>
    </form>
  </div>
</section>

  

    </>
  )
}

export default ContactSection
