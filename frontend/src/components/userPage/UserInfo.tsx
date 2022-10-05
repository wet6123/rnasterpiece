import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Card, CardContent, Tooltip } from '@mui/material';
import { Instance } from '@popperjs/core';
import { fetchUser } from '../../_slice/UserSlice';
import useCopyClipBoard from '../../_hook/useCopyClipBoard';
import NFTPreview from '../../commons/NFTPreview';

const StyledCardList = styled.div`
  margin: 20px 0 10px;
  display: flex;
  > * {
    margin: 2px;
  }
`;

const StyledCopyWallet = styled.div`
  cursor: pointer;
`;

export interface UserInfoType {
  walletAddress: String;
}
export default function UserInfo({ walletAddress }: UserInfoType) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(walletAddress));
  }, []);

  const searchedUser = useSelector((state: any) => state.user.searchedUser);

  // 클릭 시 지갑주소 복사

  const [isCopy, onCopy] = useCopyClipBoard();

  const handleCopy = (text: string) => {
    onCopy(text);
  };

  // 툴팁
  const positionRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const popperRef = React.useRef<Instance>(null);
  const areaRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  return (
    <StyledCardList>
      <Card sx={{ width: '30%', minWidth: 200, marginRight: '5px'}}>
        <NFTPreview url={`${searchedUser.profileImage}`} />
      </Card>
      <Card sx={{ width: '70%' }}>
        <CardContent>
          <h1>{searchedUser.nickname}</h1>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <Tooltip
            title="Copy"
            arrow
            placement="top"
            PopperProps={{
              popperRef,
              anchorEl: {
                getBoundingClientRect: () =>
                  new DOMRect(positionRef.current.x, areaRef.current!.getBoundingClientRect().y, 0, 0),
              },
            }}>
            <StyledCopyWallet
              onClick={() => {
                handleCopy(`${searchedUser.wallet_address}`);
              }}
              tabIndex={0}
              role="button"
              ref={areaRef}
              onMouseMove={handleMouseMove}>
              <strong>Wallet Address : </strong>
              {searchedUser.wallet_address}
            </StyledCopyWallet>
          </Tooltip>
          <div style={{margin: '7px 0'}}>
            <strong>Joined : </strong>
            {searchedUser.joinDate}
          </div>
          <div>{searchedUser.message}</div>
        </CardContent>
      </Card>
    </StyledCardList>
  );
}
