import { useState } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera } from 'react-icons/fi';
import { Container, Form, Avatar } from './styles';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

import { api } from '../../services/api';

import avatarPlaceHolder from '../../assets/images/avatar-placeholder.svg';

import { Input } from './../../components/Input';
import { Button } from './../../components/Button';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [passwordOld, setPasswordOld] = useState();
  const [passwordNew, setPasswordNew] = useState();

  const avatarUrl = user.avatar ? `${api.defaults.baseURL}/files/${user.avatar}` : avatarPlaceHolder;

  const [avatar, setAvatar] = useState(avatarUrl); // If the user already has an avatar, it will be added here. State that shows the avatar.
  const [avatarFile, setAvatarFile] = useState(null); // Used to load the new avatar image uploaded by the user. State that updates the avatar.
  
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  async function handleUpdate() {
    const updated = {
      name,
      email,
      password: passwordNew,
      old_password: passwordOld,
    }

    const userUpdated = Object.assign(user, updated);

    await updateProfile({ user: userUpdated, avatarFile });
  }

  function handleAvatarUpdate(event) {
    const file = event.target.files[0]; // Get the avatar file.
    
    setAvatarFile(file); // Set the avatar file to the state.

    const imagePreview = URL.createObjectURL(file);
    setAvatar(imagePreview);
  }

  return (
    <Container>
      <header>
        <button type="button" onClick={handleBack}>
          <FiArrowLeft size={24} />
        </button>
      </header>

      <Form>
        <Avatar>
          <img 
            src={avatar}
            alt="User Photo" 
          />
          
          <label htmlFor="Avatar">
            <FiCamera />

            <input 
              id="Avatar" 
              type="file" 
              onChange={handleAvatarUpdate}
            />
          </label>
        </Avatar>

        <Input 
          placeholder="Name"
          type="text"
          icon={FiUser}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input 
          placeholder="Email"
          type="text"
          icon={FiMail}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input 
          placeholder="Current password"
          type="password"
          icon={FiLock}
          onChange={e => setPasswordOld(e.target.value)}
        />
        <Input 
          placeholder="New password"
          type="password"
          icon={FiLock}
          onChange={e => setPasswordNew(e.target.value)}
        />

        <Button title="Save" onClick={handleUpdate}/>
      </Form>
    </Container>
  )
}