import styled, {css} from 'styled-components';
const ItemContainer = styled.div`
  display: flex;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid lightgray;
  gap: 0.25rem;
  cursor: pointer;
  &:first-child {
    border-top: 1px solid lightgray;
  }
  &:nth-child(2) {
    background-color: rgba(240, 240, 240, 0.8);
  }
  &:hover {
    background-color: rgba(222, 222, 222, 0.8);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  & .middle {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:hover .vid-img {
    transform: scale(1.05);
    opacity: 0.65;
  }
  &:hover .middle {
    opacity: 1;
    z-index: 1;
  }
`;
const VideoDescription = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  margin: 0.25rem;
  flex-direction: column;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
`;

const ItemTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const ItemChapters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  & p {
    font-size: 0.75rem;
  }
  & p:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Section = styled.p`
  font-size: 1rem;
`;

const Chapter = styled.span`
  padding: 0.2rem;
  font-size: 0.8rem;
  border: 1px grey solid;
  border-radius: 5px;
  &.active{
    background: rgba(102, 171, 255, 0.8);
    color: white;
  }
  &:hover{
    background: rgba(102, 171, 255, 0.8);
    color: white;
    transform: translateY(-3px);
  }
  transition: 0.2s ease-out;
`;

const VideoImage = styled.img`
  width: 150px;
  height: 150px;
  transition: 0.2s ease-in-out;
`;

export {
  ItemContainer,
  ItemTitle,
  VideoDescription,
  ItemChapters,
  Section,
  VideoImage,
  Chapter,
  ImageContainer,
};
