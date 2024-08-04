
const Profile = () => {
  const path = window.location.pathname;
  const parts = path.split('/');
  const username = parts[2];
  const usernameExists = false;

  if(usernameExists){
  return (
    
    <div>
      this is {username} {/** OVER HERE I WANT TO GET WHATS AFTER profile/ */}
      <p>hi</p>
    </div>
  )
}else{
  return(
    <div>
      THIS USER DOES NOT EXIST
    </div>
  )
}
}

export default Profile
