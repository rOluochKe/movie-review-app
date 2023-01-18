import React, { useState } from "react";
import { forgetPassword } from "../../api/auth";
import { useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import Container from '../Container'
import Title from '../form/Title'
import FormInput from '../form/FormInput'
import Submit from '../form/Submit'
import CustomLink from '../CustomLink'
import { commonModalClasses } from '../../utils/theme'
import FormContainer from '../form/FormContainer'

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email))
      return updateNotification("error", "Invalid email!");

    const { error, message } = await forgetPassword(email);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + ' w-96'}>
          <Title>Please enter your email</Title>
          <FormInput 
            onChange={handleChange}
            value={email}
            label='Email' 
            placeholder='john.doe@email.com' 
            name='email' 
          />
          <Submit value='Send Link' />

          <div className='flex justify-between'>
            <CustomLink to='/auth/signin'>Sign In</CustomLink>
            <CustomLink to='/auth/signup'>Sign Up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  )
}
