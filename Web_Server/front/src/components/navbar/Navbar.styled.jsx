import styled from 'styled-components';

const NavContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & * {
    margin: 0 0.5rem;
    cursor: pointer;
  }
  & .nav-profile {
    transition: 0.25s ease-in-out;
  }
  & .nav-profile:hover {
    transform: scale(1.1);
  }
  & .nav-gear {
    transition: 0.25s ease-in-out;
  }
  & .nav-gear:hover {
    transform: scale(1.1) rotate(90deg);
  }
  & .nav-logo:hover {
    animation: tilt-shaking 1s;
  }

  @keyframes tilt-shaking {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(5deg);
    }
    50% {
      transform: rotate(0eg);
    }
    75% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const NavContentContainer = styled.div`
  width: 100%;
  height: 75px;
  border-bottom: 5px solid #d0dae8;
`;

const NavLink = styled.button`
  text-transform: capitalize;
  padding: 0.75em 1.25em;
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: #e6e6e697;
    transform: translateY(-5px) scale(1.05);
  }
  & a,
  a:visited {
    font-family: 'Roboto Slab';
    color: inherit;
    text-decoration: none;
  }
  &:hover a,
  &:hover a:visited {
    color: rgba(102, 171, 255, 0.8);
  }
  &.current {
    color: white;
    background-color: rgba(102, 171, 255, 0.8);
  }
  &.current:hover a {
    color: white;
  }
  transition: 0.25s ease-in-out;
`;

const NavLinkContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
`;
export { NavContainer, NavLink, NavLinkContainer, NavContentContainer };
