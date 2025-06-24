export async function generateStaticParams() {
  // Fetch all users to get their IDs
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();
  
  // Return array of params objects
  return users.map((user) => ({
    id: user.id.toString(), // Convert to string as URL params are strings
  }));
}

export default async function UserDetails({ params }) {
  const {id} = await params;
  console.log(id);
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const user = await res.json();
  
  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Website:</strong> {user.website}</p>
    </div>
  );
}
