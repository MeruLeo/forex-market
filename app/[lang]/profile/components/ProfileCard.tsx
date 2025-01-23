import React from 'react';
import InputWithLabel from './InputWithLabel'; 


export interface Profile {
  username: string;
  phone: string;
  email: string;
  bank_number: string;
  bank_number_2: string;
  bank_number_3: string;
  realname: string;
}

export interface ProfileCardProps {
  profile: Profile;
  dict: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, dict }) => {
  
  return (
    <div className="px-2 py-2 border rounded-md shadow-lg">
      <div className='w-full border-b-2 mb-2'>
        <h1 className="text-lg font-bold mb-4 text-right">{dict.profile.profile.title}</h1>
      </div>
      <div className="profile-info ">
        
        <InputWithLabel
          label={dict.profile.profile.username}
          value={profile.username}
          type="text"
          disabled={true}
        />

        <InputWithLabel
          label={dict.profile.profile.realname}
          value={profile.realname}
          type="text"
          disabled={true}
        />

        <InputWithLabel
          label={dict.profile.profile.phone}
          value={profile.phone}
          type="text"
          disabled={true}
        />

      <InputWithLabel
          label={dict.profile.profile.bank_num1}
          value={profile.bank_number}
          type="text"
          disabled={true}
        />
        <InputWithLabel
          label={dict.profile.profile.bank_num2}
          value={profile.bank_number_2}
          type="text"
          disabled={true}
        />
        <InputWithLabel
          label={dict.profile.profile.bank_num3}
          value={profile.bank_number_3}
          type="text"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
