import React, { useEffect } from "react";

// Safari(iOS) 가상키보드 : INPUT이 활성화 됐을때 스크롤(터치무브)하면 INPUT 비활성화
// const useInputScroll = (emailRef, passwordRef, inputRef) => {
const useInputScroll = (firstInputRef, secondInputRef, thirdInputRef) => {
  const handleScroll = (e) => {
    const activeElement = document.activeElement;

    // 첫 번째 input이 활성화된 경우
    if (
      activeElement === firstInputRef.current ||
      firstInputRef.current?.contains(e.target)
    ) {
      activeElement.blur();
    }

    // 두 번째 input이 활성화된 경우
    if (
      activeElement === secondInputRef.current ||
      secondInputRef.current?.contains(e.target)
    ) {
      activeElement.blur();
    }

    // 세 번째 input이 존재하고 활성화된 경우
    if (
      thirdInputRef &&
      (activeElement === thirdInputRef.current ||
        thirdInputRef.current?.contains(e.target))
    ) {
      activeElement.blur();
    }
  };
  useEffect(() => {
    window.addEventListener("touchmove", handleScroll);
    return () => {
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [firstInputRef, secondInputRef, thirdInputRef]);
};

export default useInputScroll;
