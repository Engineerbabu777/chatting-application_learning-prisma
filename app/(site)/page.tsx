import Image from 'next/image'
import AuthForm from './components/authentication/AuthForm'

export default function Home () {
  return (
    <>
      {/* PARENT MAIN CONTAINER! */}
      <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100'>
        {/* INSIDE CHILD CONTAINERS */}
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          {/* ITEMS INSIDE CONTAINER! */}
          <Image
            alt='Logo'
            src={'/logo.png'}
            className='mx-auto w-auto '
            height={48}
            width={48}
          />

          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Log in to your account
          </h2>
        </div>
        {/* AUTH FORM! */}
        <AuthForm />
      </div>
    </>
  )
}
