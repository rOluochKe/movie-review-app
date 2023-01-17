import React from 'react'
import Container from '../Container'
import Title from '../form/Title'
import FormInput from '../form/FormInput'
import Submit from '../form/Submit'
import CustomLink from '../CustomLink'
import { commonModalClasses } from '../../utils/theme'
import FormContainer from '../form/FormContainer'

export default function Signup () {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + ' w-96'}>
          <Title>Sign Up</Title>
          <FormInput label='Name' placeholder='John Doe' name='name' />
          <FormInput label='Email' placeholder='john.doe@email.com' name='email' />
          <FormInput label='Password' placeholder='********' name='password' />
          <Submit value='Sign Up' />

          <div className='flex justify-between'>
            <CustomLink to='/auth/forget-password'>Forget Password</CustomLink>
            <CustomLink to='/auth/signin'>Sign In</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  )
}