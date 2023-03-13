import styled from '@emotion/styled';

export const Toolbar = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  height: 100%;
  line-height: initial;
`;

export const ToolbarItem = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 8px;
  border-radius: 8px;
  font-size: 32px;
  background-color: transparent;
  border: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2)
  }
`;
