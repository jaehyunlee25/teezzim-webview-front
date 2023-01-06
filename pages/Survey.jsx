import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Survey() {
    const router = useRouter();

    const areaOptions = [
        { value: "seoul", name: "서울특별시" },
        { value: "sejong", name: "세종특별자치시" },
        { value: "incheon", name: "인천광역시" },
        { value: "daejeon", name: "대전광역시" },
        { value: "gwangju", name: "광주광역시" },
        { value: "daegu", name: "대구광역시" },
        { value: "ulsan", name: "울산광역시" },
        { value: "busan", name: "부산광역시" },
        { value: "gyeonggi", name: "경기도" },
        { value: "gangwon", name: "강원도" },
        { value: "chungcheongbuk", name: "충청북도" },
        { value: "chungcheongnam", name: "충청남도" },
        { value: "jeollabuk", name: "전라북도" },
        { value: "jeollanam", name: "전라남도" },
        { value: "gyeongsangbuk", name: "경상북도" },
        { value: "gyeongsangnam", name: "경상남도" },
        { value: "jeju", name: "제주도" },
    ]

    const ageOptions = [...Array(17)].map((_, i) => { return { value: i, label: `${(i + 1) * 5 + 10}~${(i + 1) * 5 + 15}세` } });

    const [area, setArea] = useState('');
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState(0);
    const [isAgree, setIsAgree] = useState(false);

    const isDisable = useMemo(() => {
        if (area !== '' && isAgree) return 'bg-grey8';
        else return 'bg-disable';
    }, [area, isAgree]);

    const submit = () => {
        if (area !== '' && isAgree) {
            const res = {
                command: 'app_init_survey_result',
                data: { area: area, age: age, gender: gender, agree: isAgree },
            };
            if (window.BRIDGE && window.BRIDGE.sendResponse) {
                window.BRIDGE.sendResponse(JSON.stringify(res));
            } else if (window.webkit && window.webkit.messageHandlers) {
                window.webkit.messageHandlers.sendResponse.postMessage(JSON.stringify(res));
            }

            window.localStorage.setItem('isSurvey', true);
            router.push({
                href: '/home',
            });
        }
    }

    return (
        <div className="survey-container">
            <div className='survey-icon mb-20' />
            <p className="survey-desc mb-50">다음의 설문에 응해주시면 앱사용이 가능합니다.</p>
            <div className="survey-wrap">
                <p className="survey-title">귀하의 거주지역은?</p>
                <div className="select-wrap">
                    <select value={area} onChange={(e) => setArea(e.target.value)}>
                        <option value="" disabled defaultValue>시/도</option>
                        {
                            areaOptions.map((option, i) => (
                                <option key={i} value={option.value}>
                                    {option.name}
                                </option>
                            ))
                        }
                    </select>
                    <div className="down-btn" />
                </div>
            </div>
            <div className="survey-wrap">
                <p className="survey-title">귀하의 연령대는?</p>
                <div className="select-wrap">
                    <select value={age} onChange={(e) => setAge(e.target.value)}>
                        {
                            ageOptions.map((option, i) => (
                                <option key={i} value={option.value}>
                                    {option.label}
                                </option>
                            ))
                        }
                    </select>
                    <div className="down-btn" />
                </div>
            </div>
            <div className="survey-wrap">
                <p className="survey-title">귀하의 성별은?</p>
                <div className="gender-btn-wrap mb-25">
                    <div className='col col-55'>
                        <button
                            type='button'
                            className={`btn small-roundbtn full ${gender === 0 ? ' text-white bg-active' : 'bg-inactive'}`}
                            onClick={() => setGender(0)}
                        >
                            남
                        </button>
                    </div>
                    <div className='col col-55'>
                        <button
                            type='button'
                            className={`btn small-roundbtn full ${gender === 1 ? ' text-white bg-active' : 'bg-inactive'}`}
                            onClick={() => setGender(1)}
                        >
                            여
                        </button>
                    </div>
                </div>
                <div className='survey-agree-wrap'>
                    <div className='btn_check_box' onClick={() => setIsAgree(!isAgree)}>
                        <span className='agree-checkbox'>
                            <input
                                type='checkbox'
                                checked={isAgree}
                                readOnly
                            />
                            <label htmlFor={1}></label>
                        </span>
                    </div>
                    <p className="survey-agree-text">개인정보 제3자 정보제공에 동의합니다.</p>
                </div>
            </div>
            <button
                type='button'
                className={`btn medium-roundbtn full text-white ${isDisable}`}
                onClick={() => submit()}
            >
                확인
            </button>
            <style jsx>{`
                .btn_check_box {
                margin: 0px;
                }
                label {
                padding: 8px;
                }
            `}</style>
        </div>
    )
}