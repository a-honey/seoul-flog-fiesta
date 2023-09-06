import { useEffect, useState } from 'react';
import * as Api from '../../api';
import { useLocation } from 'react-router-dom';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { openToast, setToastMessage } from '../../features/toastSlice';
import { toggleGroupRequestList } from '../../features/relationSlice';

const GroupRequestList = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [datas, setDatas] = useState([]);
  const dispatch = useDispatch();

  const location = useLocation();
  const currentPath = location.pathname;

  const id = currentPath.split('/')[2];

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);
        const res = await Api.get(`/group/join/req/${id}`);
        console.log('res: ', res);
        if (!res.data) {
          setDatas([]);
        } else {
          setDatas(res.data);
        }
      } catch (err) {
        console.log(
          '해당그룹가입목록을 불러오는데 실패.',
          err.response.data.message,
        );
        setDatas([]);
      } finally {
        setIsFetching(false);
      }
    };

    getData();
  }, [id]);

  return (
    <div className="modal">
      <form>
        {isFetching ? (
          <div>로딩중</div>
        ) : datas.length === 0 ? (
          <div>가입 요청이 없습니다</div>
        ) : (
          datas.map((data) => <Item data={data} id={id} setDatas={setDatas} />)
        )}
        <button
          onClick={() => {
            dispatch(toggleGroupRequestList());
          }}
          className="gBtn"
        >
          뒤로가기
        </button>
      </form>
    </div>
  );
};

export default GroupRequestList;

const Item = ({ data, setDatas, id }) => {
  const dispatch = useDispatch();

  const handleOk = async (e) => {
    e.preventDefault();

    try {
      await Api.post(`/group/accept/${id}/${data.id}`);
      setDatas((datas) => datas.filter((el) => el.id !== data.id));
      dispatch(setToastMessage(`${data.nickname} 친구 수락 성공`));
      dispatch(openToast());
    } catch (err) {
      alert('수락 실패', err.response.data.message);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();

    try {
      await Api.post(`/group/reject/${id}/${data.id}`);
      alert('거절 성공');
    } catch (err) {
      alert('거절 실패', err.response.data.message);
    }
  };

  return (
    <div className={styles.requestItem}>
      <div>{data.nickname}</div>
      <div>
        <button onClick={handleOk}>수락</button>
        <button onClick={handleReject}>거절</button>
      </div>
    </div>
  );
};
