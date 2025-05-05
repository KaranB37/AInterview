import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            alt="Interview preparation"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative z-20 flex h-full items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <h2 className="mb-6 text-3xl font-thin tracking-tight text-white sm:text-4xl">
                Join our interview preparation platform
              </h2>
              <p className="text-white/90 font-light tracking-wide">
                Create your account to access AI-powered interview simulations and improve your chances of landing your dream job.
              </p>
            </div>
          </div>
        </aside>
    
        <main
          className="flex items-center justify-center px-8 py-10 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <div className="mb-12">
              <h1 className="text-3xl font-medium text-gray-900 mb-2">
                Create your Hire<span className="font-semibold">Buddy</span> account
              </h1>
              <p className="text-gray-500 text-sm">Sign up to begin your interview preparation journey</p>
            </div>
            
            <div className="rounded-xl border border-gray-100 shadow-sm p-6 bg-white">
              <SignUp redirectUrl="/dashboard" />
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}