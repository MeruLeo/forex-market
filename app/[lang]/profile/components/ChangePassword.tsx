import { useState } from 'react';
import { toast } from 'sonner';
import IconButton from '@mui/material/IconButton';
import KeyIcon from '@mui/icons-material/Key';


const ChangePasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(''); // Reset error when opening modal
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        toast("Password changed successfully. You will be logged out.")
        localStorage.removeItem('token'); // Logout user
        toggleModal(); // Close modal
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to change password.');
        toast(data.message || 'Failed to change password.');
      }
    } catch (error) {
        toast('An error occurred while changing password.');
    }
  };

  return (
    <>
      <IconButton color="inherit" size='small' onClick={toggleModal}>
                <KeyIcon />
        </IconButton>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className='mb-2'>Change Password</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleChangePassword}>
              <div>
                <label htmlFor="old-password" >Old Password</label>
                <input
                  type="password"
                  id="old-password"
                  className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
                <button  type="submit" className='mr-4 border rounded-md px-2' >
                Submit
                </button>
                <button  type="submit" className='mr-4 border rounded-md px-2' onClick={toggleModal} >
                Cancel
                </button>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          width: 300px;
        }
        .error {
          color: red;
        }
      `}</style>
    </>
  );
};

export default ChangePasswordModal;
