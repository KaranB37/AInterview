import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <>
  <section className="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
      <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          alt="Interview environment"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2984&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
      
      </aside>
  
      <main
        className="flex items-center justify-center px-8 py-10 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
      >
        <div className="max-w-xl lg:max-w-3xl">
        
          
          <div className="rounded-xl border border-gray-100 shadow-sm p-6 bg-white">
            <SignIn redirectUrl="/dashboard"/>
          </div>
        </div>
      </main>
    </div>
  </section></>
}