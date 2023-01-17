import React from 'react'
import Container from '../Container'
import Title from '../form/Title'
import FormInput from '../form/FormInput'
import Submit from '../form/Submit'
import { commonModalClasses } from '../../utils/theme'
import FormContainer from '../form/FormContainer'

export default function ConfirmPassword() {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + ' w-96'}>
          <Title>Enter new password</Title>
          <FormInput 
            type='password' 
            label='New Password' 
            placeholder='********' 
            name='password' 
          />
          <FormInput 
            type='password' 
            label='Confirm Password' 
            placeholder='********' 
            name='confirmPassword' 
          />
          <Submit value='Confirm Password' />
        </form>
      </Container>
    </FormContainer>
  )
}
