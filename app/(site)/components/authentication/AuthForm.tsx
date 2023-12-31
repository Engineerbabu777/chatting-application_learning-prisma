'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../shared/Input'
import Button from '../shared/Button'
import AuthSocialButtons from '../shared/AuthSocialButtons'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import axios from 'axios'
import toast from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Props = {}

type Variant = 'LOGIN' | 'REGISTER'
export default function AuthForm({}: Props) {
  // OUR STATES FOR THIS COMPONENT!
  const [variant, setVariant] = useState < Variant > ('LOGIN')
  const [loading, setLoading] = useState < boolean > (false)

  const { status: sessionStatus, data: sessionData } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      console.log('Authenticated User!')
      router.push('/users')
    }
  }, [sessionStatus, router])

  // USING REACT_HOOK_FORM HERE!
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm <
  FieldValues >(
  { defaultValues: { name: '', email: '', password: '' } }
  )// SUBMIT HANDLER!
  const onSubmit: SubmitHandler<FieldValues> = data => {
    setLoading(true)

    // FOR LOGIN!
    if (variant === 'LOGIN') {
      // LOGIN LOGIC HERE!
      signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
        .then(response => {
          if (response?.error) {
            toast.error('Invalid Credentials')
          }
          if (response?.ok && !response?.error) {
            toast.success('Login Successful')
          }
        })
        .finally(() => {
          setLoading(false)
          router.push('/users')
        })
    }

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then((response: Promise<Response>) => {
          console.log('RESPONSE-> ', response?.data)
          setLoading(false)
          toast.success('Registration successful!')
          signIn('credentials',{
            email: data.email,
            password: data.password,
            redirect: false
          }).then(response => {
            if (response?.error) {
              toast.error('Invalid Credentials')
            }
            if (response?.ok && !response?.error) {
              toast.success('Login Successful')
            }
          })
          .finally(() => {
            setLoading(false)
            router.push('/users')
          })
        })
        .catch((error: any) => {
          console.log('Error while registration ', error?.message)
          setLoading(false)
          toast.error('Something went wrong!')
        })
        
    }
  }

  // SOCIAL LOGINS!
  const socialActions = (action: string) => {
    setLoading(true)
    // NEXT-AUTH.JS SOCIAL LOGINS!
    signIn(action)
      .then(response => {
        if (response?.error) {
          toast.error('Invalid Credentials')
        }
        if (response?.ok && !response?.error) {
          toast.success('Login Successful')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // TOGGLE FUNCTION FOR VARIANT!
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  return (
    <>
      {/* PARENT CONTAINER! */}
      <div className='mt-8 sm:w-full sm:max-w-md sm:mx-auto'>
        {/* CARD! */}
        <div className='bg-white px-4 py-8 sm:rounded-lg sm:px-8'>
          {/* FORM HERE! */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* INPUTS! */}
            <>
              {variant === 'REGISTER' && (
                <Input
                  label={'Name'}
                  id={'name'}
                  register={register}
                  errors={errors}
                  type={'text'}
                  disabled={loading}
                />
              )}
              <Input
                label={'Email address'}
                id={'email'}
                register={register}
                errors={errors}
                type='email'
                disabled={loading}
              />
              <Input
                label={'Password'}
                id={'password'}
                register={register}
                errors={errors}
                type='password'
                disabled={loading}
              />
            </>

            {/* BUTTON! */}
            <div>
              <Button disabled={loading} type={'submit'} fullWidth>
                {variant === 'LOGIN' ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
          </form>

          {/* BELOW NOTE: */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500'>
                  Or Continue with
                </span>
              </div>
            </div>
            {/* SOCIAL BUTTONS! */}
            <div className='mt-6 flex gap-2'>
              <AuthSocialButtons
                icon={BsGithub}
                onClick={() => socialActions('github')}
              />
              <AuthSocialButtons
                icon={BsGoogle}
                onClick={() => socialActions('google')}
              />
            </div>
          </div>

          {/* NOTE! */}
          <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
            <div className=''>
              {variant === 'LOGIN'
                ? 'New to messenger?'
                : 'Already have an account?'}
            </div>
            <div className='underline cursor-pointer' onClick={toggleVariant}>
              {variant === 'LOGIN' ? 'Sign Up' : 'Sign In'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
