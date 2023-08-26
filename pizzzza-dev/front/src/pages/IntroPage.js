import { useEffect } from 'react';
import IntroContainer from '../containers/intro';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const IntroPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // 로그인 상태면 홈 페이지로 이동시킴
  useEffect(() => {
    if (user.email) {
      navigate('/');
    }
  }, [navigate, user]);
  return <IntroContainer />;
};

export default IntroPage;
