import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import React, { useEffect, useState } from 'react';
import Api from '../../api';
import { handleImgUrl } from '../../utils/handleImgUrl';
import user_none from '../../assets/user_none.png';
import { openToast, setToastMessage } from '../../features/toastSlice';
import { useDispatch } from 'react-redux';
import { NetworkUserType } from '../../types/fetchDataTypes';

const MyUsers = () => {
  const [datas, setDatas] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);
        const res = await Api.get(`/friends`);
        console.log('res', res);
        if (res.data.friendsList.user) {
          //{"message":"친구 목록","friendsList":[{"userB":{"id":1,"nickname":"끼룩끼룩","about":null,"activity":null}}]}
          setDatas(res.data.friendsList.user);
        } else {
          setDatas([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsFetching(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="gContainer">
      <div className="titleContainer">
        <h1>나의 친구들</h1>
        <button
          className="gBtn"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          친구 관리
        </button>
      </div>
      <div className={styles.shortBox}>
        {isFetching ? (
          <div>로딩중</div>
        ) : datas.length === 0 ? (
          <div>데이터가 없습니다</div>
        ) : (
          datas.map((data: NetworkUserType) => (
            <MyUser
              isEditing={isEditing}
              key={`my_group_list_${data.id}`}
              data={data}
              setDatas={
                setDatas as React.Dispatch<
                  React.SetStateAction<NetworkUserType[]>
                >
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyUsers;

const MyUser = ({
  data,
  isEditing,
  setDatas,
}: {
  data: NetworkUserType;
  isEditing: boolean;
  setDatas: React.Dispatch<React.SetStateAction<NetworkUserType[]>>;
}) => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        await Api.delete(`/user/drop/${data.id}`);
        setDatas((datas) => datas.filter((prev) => prev.id !== data.id));
        dispatch(setToastMessage('인증글이 생성되었습니다.'));
        dispatch(openToast());
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('친구 삭제가 취소되었습니다.');
    }
  };

  return (
    <div
      className={styles.myGroup}
      onClick={() => {
        navigator(`/users/${data.id}?view=main`);
      }}
    >
      <div className={styles.imgContainer}>
        <img
          src={data.imageUrl ? handleImgUrl(data.imageUrl) : user_none}
          alt="이미지"
        />
      </div>
      <div>{data.nickname}</div>
      {isEditing && (
        <button
          className={styles.delete}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          X
        </button>
      )}
    </div>
  );
};
