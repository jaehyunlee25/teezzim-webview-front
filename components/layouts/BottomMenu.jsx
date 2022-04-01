import Image from "next/image";
import CalenderIcon from "@/assets/images/frame/bottom/Icon_Calendar.svg";
import CheckedOutlineIcon from "@/assets/images/frame/bottom/Icon_Checed-Outline.svg";
import MenuIcon from "@/assets/images/frame/bottom/Icon_Menu.svg";

const BottomMenu = () => {
  return (
    <>
      <div id="footer">
        <div className="inner">
          <div className="tabbar">
            <ul>
              <li>
                <div>
                  <Image src={CalenderIcon} alt="예약하기" />
                  <span>예약하기</span>
                </div>
              </li>
              <li>
                <div>
                  <Image src={CheckedOutlineIcon} alt="나의 예약" />
                  <span>나의 예약</span>
                </div>
              </li>
              {/* menu button 누르면 navigation menu 열기 */}
              <li>
                <div>
                  <Image src={MenuIcon} alt="메뉴" />
                  <span>메뉴</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          #footer {
            position: relative;
          }
          #footer .inner {
          }
          /*하단고정*/
          .tabbar {
            width: 100%;
            position: fixed;
            bottom: 0px;
            background: #fff;
            margin: 0 auto;
            left: 0;
            right: 0;
            border-top: 1px solid #e0e0e0;
          }
          .tabbar {
            padding: 0px 0 calc(constant(safe-area-inset-bottom) + 3px);
            padding: 0px 0 calc(env(safe-area-inset-bottom) + 3px);
          }
          .tabbar:afrer {
            content: "";
            display: inline-block;
            clear: both;
          }
          .tabbar ul {
            margin: 0 16px;
            text-align: center;
          }
          .tabbar li {
            display: inline-block;
            width: 32%;
            height: 45px;
            font-family: AppleSDGothicNeo-SemiBold;
            margin-top: 3px;
          }
          .tabbar li img {
            width: 28px;
            height: 28px;
          }
          .tabbar li div.on {
            background: #115b40;
            display: inline-block;
            width: 72px;
            height: 45px;
            border-radius: 4px;
          }
          .tabbar li div.on span {
            color: #fff;
          }
          .tabbar li span {
            display: block;
            color: #323233;
            font-weight: 600;
            line-height: 1.3;
            font-size: 13px;
          }
        `}
      </style>
    </>
  );
};

export default BottomMenu;
