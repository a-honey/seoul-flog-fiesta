import { useSelector } from 'react-redux';
import Layout from './Layout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/user/Login';

const LoginPage = () => {
  const navigator = useNavigate();
  const user = useSelector((state) => state.user);

  const token = localStorage.getItem('userToken');
  // user의 상태가 존재하면 홈 페이지로 이동시킴
  useEffect(() => {
    if (token && !user.email === '') {
      navigator('/');
    }
  });

  return (
    <Layout>
      <main>
        <Login />
      </main>
    </Layout>
  );
};

export default LoginPage;
