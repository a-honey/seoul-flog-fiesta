import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Api from '../../api';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const [datas, setDatas] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleInputChange = async (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);

    try {
      const res = await Api.get(`/user/${newSearchText}`);
      setSearchResult(res.data.searchNickname);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);
        const res = await Api.get('/unread');
        setDatas(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsFetching(false);
      }
    };

    const intervalId = setInterval(() => {
      getData();
    }, 5000);

    getData();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.chatList}>
      <input
        type="text"
        value={searchText}
        onChange={handleInputChange}
        placeholder="유저의 별명을 검색하세요"
      />
      {searchResult && <UserItem data={searchResult} />}
      {isFetching ? (
        <div>로딩중</div>
      ) : !datas || datas.length === 0 ? (
        <div>채팅 서비스 준비중</div>
      ) : (
        datas.map((data) => <Item data={data} />)
      )}
    </div>
  );
};

export default ChatList;

const Item = ({ data }) => {
  return (
    <div>
      <div>_님과의 채팅</div>
      <div>{data}</div>
    </div>
  );
};

const UserItem = ({ data }) => {
  const navigator = useNavigate();

  return (
    <div className={styles.userItem}>
      <div
        onClick={() => {
          navigator(`/users/${data.id}?view=main`);
        }}
      >
        {data.nickname}
      </div>
    </div>
  );
};
