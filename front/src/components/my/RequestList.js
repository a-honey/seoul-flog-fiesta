import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import * as Api from '../../api';
import { toggleRequestList } from '../../features/relationSlice';
import { useDispatch } from 'react-redux';


const RequestList = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [datas, setDatas] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);
        const res = await Api.get(`/req/list`);
        setDatas(res.data.friendRequest.map((data) => data.userA));
      } catch (err) {
        console.log(
          '친구요청목록을 불러오는데 실패.',
          err.response.data.message,
        );
      } finally {
        setIsFetching(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="modal">
      <form>
        {isFetching ? (
          <div>로딩중</div>
        ) : datas.length === 0 ? (
          <div>친구 요청이 없습니다</div>
        ) : (
          datas.map((data) => <Item data={data} setDatas={setDatas} />)
        )}
        <button
          onClick={() => {
            dispatch(toggleRequestList());
          }}
          className="gBtn"
        >
          뒤로가기
        </button>
      </form>
    </div>
  );
};

export default RequestList;

const Item = ({ data, setDatas }) => {
  const handleOk = async (e) => {
    e.preventDefault();
    try {
      await Api.post(`/accept/${data.id}`);
      setDatas((datas) => datas.filter((prev) => prev.id !== data.id));
      alert('수락 성공');
    } catch (err) {
      alert('수락 실패', err.response.data.message);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      await Api.delete(`/reject/${data.id}`);
      setDatas((datas) => datas.filter((prev) => prev.id !== data.id));
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
