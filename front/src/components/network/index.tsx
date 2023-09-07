import React, { useEffect, useState } from 'react';
import GroupMaking from './GroupMaking';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import * as Api from '../../api';
import post_none from '../../assets/post_none.png';
import user_none from '../../assets/user_none.png';
import { seoulDistricts } from '../../assets/exportData';
import { handlePagenation } from '../../utils/handlePagenation';
import Pagination from '../common/Pagenation';
import { handleImgUrl } from '../../utils/handleImgUrl';
import { NetworkGroupType, NetworkUserType } from '../../types/fetchDataTypes';

const ItemList = () => {
  const [isModal, setIsModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [datas, setDatas] = useState([]);
  const [isCheck, setIsCheck] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const view = searchParams.get('view');

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const paginatedData = handlePagenation(datas, currentPage, itemsPerPage);

  const handlePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);

        if (!view || view === 'group') {
          if (isCheck) {
            const res = await Api.get(
              `/${view}/mygroup?limit=${itemsPerPage}&page=${currentPage}`,
            );
            setDatas(res.data.groups);
            setTotalPages(res.data.totalPages);
          } else {
            const res = await Api.get(
              `/group?limit=${itemsPerPage}&page=${currentPage}`,
            );

            setDatas(res.data.groups);
            setTotalPages(res.data.totalPages);
          }
        } else {
          if (isCheck) {
            const res = await Api.get(
              `/friends?limit=${itemsPerPage}&page=${currentPage}`,
            );
            if (!res.data.friendsList.user) {
              setDatas([]);
            } else {
              setDatas(res.data.friendsList.user);
              setTotalPages(res.data.friendsList.totalPages);
            }
          } else {
            const res = await Api.get(
              `/${view}s?limit=${itemsPerPage}&page=${currentPage}`,
            );
            setDatas(res.data.users.user);
            setTotalPages(res.data.users.totalPages);
          }
        }
      } catch (error) {
        console.log(error);
        setDatas([]);
      } finally {
        setIsFetching(false);
      }
    };
    getData();
  }, [view, isCheck, setIsCheck, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [view, isCheck]);

  return (
    <div className="gContainer  gList navVh">
      {isModal && <GroupMaking setIsModal={setIsModal} setDatas={setDatas} />}
      <NetworkHeader
        view={view}
        setIsModal={setIsModal}
        setIsCheck={setIsCheck}
      />
      <div className="contentListContainer">
        {isFetching ? (
          <div>로딩중</div>
        ) : datas.length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          datas.map((data) => (
            <Item view={view} data={data} key={`${view}_${data.id}`} />
          ))
        )}
      </div>
      <div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePage={handlePage}
        />
      </div>
    </div>
  );
};

export default ItemList;

const NetworkHeader = ({ view, setIsModal, setIsCheck }) => {
  return (
    <div className="titleContainer">
      <div>
        <h1>{view === 'group' ? '그룹' : '유저'}리스트</h1>
        <span>
          <input
            type="checkbox"
            name="isMine"
            onClick={() => {
              setIsCheck((isCheck) => !isCheck);
            }}
          />
          <div>나의 {view === 'group' ? '그룹' : '친구'}만 보기</div>
        </span>
      </div>
      {view === 'group' && (
        <button
          className="gBtn"
          onClick={() => {
            setIsModal(true);
          }}
        >
          모임 만들기
        </button>
      )}
    </div>
  );
};

const Item = ({
  data,
  view,
}: {
  data: NetworkGroupType | NetworkUserType;
  view: string;
}) => {
  const navigator = useNavigate();

  return (
    <div
      className={styles.itemContainer}
      onClick={() => {
        if (view === 'group') {
          navigator(`/${view}s/${data.id}?admin=${data.managerId}&view=main`);
        } else {
          navigator(`/${view}s/${data.id}?view=main`);
        }
      }}
    >
      <div className={styles.imgContainer} key={data.id}>
        <img
          src={
            data.images && data.images.length !== 0
              ? `${handleImgUrl(data.images[0])}`
              : data.profileImage
              ? handleImgUrl(data?.profileImage.imageUrl)
              : data.imageUrl
              ? handleImgUrl(data.imageUrl)
              : view === 'group'
              ? post_none
              : user_none
          }
          alt="그룹 이미지"
          onError={(e) =>
            view === 'group'
              ? (e.target.src = post_none)
              : (e.target.src = user_none)
          }
        />
      </div>
      <ul className={styles.item}>
        <li key="1">
          <label>{view === 'group' ? '그룹이름' : '유저별명'}</label>
          <div>{view === 'group' ? data.name : data.nickname}</div>
        </li>
        <li key="2">
          <label>{view === 'group' ? '그룹목표' : '유저소개'}</label>
          <div>{view === 'group' ? data.goal : data.about}</div>
        </li>
        <li key="3">
          <label>{view === 'group' ? '그룹지역' : '유저활동'}</label>
          <div>
            {view === 'group'
              ? seoulDistricts[data.region]
              : seoulDistricts[data.activity]}
          </div>
        </li>
        <div>
          {view === 'group' && (
            <div>
              {data.memberCount} / {data.memberLimit || 50}
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};
