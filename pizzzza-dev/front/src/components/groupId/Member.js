import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Api from '../../api';

const GroupMember = ({ view }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);
        const res = await Api.get(``);
        //setDatas(res.data);
      } catch (err) {
        console.log('멤버 리스트 데이터를 불러오는데 실패.', err);
      } finally {
        setIsFetching(false);
      }
    };

    getData();
  }, [view]);

  return (
    <div className="gContainer  gList navVh">
      <div className="titleContainer">
        <h1>멤버 리스트</h1>
      </div>
      <div className="contentListContainer">
        {isFetching ? (
          <div>로딩중</div>
        ) : datas?.length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          datas.map((data) => <Item data={data} key={data.id} view={view} />)
        )}
      </div>
      <div>페이지네이션자리</div>
    </div>
  );
};

export default GroupMember;

const Item = ({ data, view }) => {
  const navigator = useNavigate();

  return (
    <div
      onClick={() => {
        navigator(`/users/${data.id}`);
      }}
    >
      <div>그룹 인증1</div>
      <div>장소</div>
    </div>
  );
};
