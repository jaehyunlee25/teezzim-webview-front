import { makeObservable, observable, action } from 'mobx';
import ImgGolf1 from '@/assets/images/IMG_Golf_01.png';
import ImgGolf2 from '@/assets/images/IMG_Golf_02.png';
import ImgGolf3 from '@/assets/images/IMG_Golf_03.png';
import ImgGolf4 from '@/assets/images/IMG_Golf_04.png';
import ImgGolf5 from '@/assets/images/IMG_Golf_05.png';
import ImgGolf6 from '@/assets/images/IMG_Golf_06.png';
import ImgGolf7 from '@/assets/images/IMG_Golf_07.png';

/** 사이트 전체에 사용되는 전역 스토어 */
class GlobalStore {
  isTest = false;
  TeeImages = [
    ImgGolf1,
    ImgGolf2,
    ImgGolf3,
    ImgGolf4,
    ImgGolf5,
    ImgGolf6,
    ImgGolf7,
  ];

  constructor() {
    makeObservable(this, {
      isTest: observable,
      TeeImages: observable,
      toggleIsTestValue: action,
    });
    this.isTest = true;
  }

  toggleIsTestValue() {
    this.isTest = !this.isTest;
  }
}

const globalStore = new GlobalStore();
export default globalStore;
