import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchModelCodes, login, signup } from '../../api/auth';
import { setStoredSession } from '../../utils/authStorage';

const initialLoginForm = {
  userId: '',
  password: ''
};

const initialSignupForm = {
  userId: '',
  password: '',
  userName: '',
  vehicleId: '',
  modelCode: '1'
};

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [signupForm, setSignupForm] = useState(initialSignupForm);
  const [modelCodes, setModelCodes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchModelCodes()
      .then((models) =>
        setModelCodes(models.filter((model) => Number(model.code) >= 1))
      )
      .catch(() => {
        setModelCodes([
          { code: 1, modelName: 'Model 1' },
          { code: 2, modelName: 'Model 2' },
          { code: 3, modelName: 'Model 3' },
          { code: 4, modelName: 'Model 4' }
        ]);
      });
  }, []);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      const result = await login(loginForm);
      setStoredSession(result);

      if (result.role === 'operator') {
        navigate('/operator/infra-service');
        return;
      }

      navigate('/user/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      const result = await signup(signupForm);
      setSuccessMessage(
        `${result.message} 발급된 회원 번호는 ${result.user.id}번입니다. 이제 로그인해 주세요.`
      );
      setSignupForm(initialSignupForm);
      setMode('login');
      setLoginForm((prev) => ({ ...prev, userId: signupForm.userId }));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-card auth-card">
        <div className="auth-switch">
          <button
            type="button"
            className={`auth-switch-button${mode === 'login' ? ' active' : ''}`}
            onClick={() => {
              resetMessages();
              setMode('login');
            }}
          >
            로그인
          </button>
          <button
            type="button"
            className={`auth-switch-button${mode === 'signup' ? ' active' : ''}`}
            onClick={() => {
              resetMessages();
              setMode('signup');
            }}
          >
            회원가입
          </button>
        </div>

        <h1>{mode === 'login' ? 'Web Platform Login' : 'Web Platform Sign Up'}</h1>
        <p>
          {mode === 'login'
            ? '일반 사용자 계정을 회원가입 후 로그인할 수 있습니다.'
            : '회원가입은 사용자 계정만 가능합니다.'}
        </p>

        {errorMessage ? <div className="auth-message error">{errorMessage}</div> : null}
        {successMessage ? (
          <div className="auth-message success">{successMessage}</div>
        ) : null}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <label>
              아이디
              <input
                type="text"
                name="userId"
                value={loginForm.userId}
                onChange={handleLoginChange}
                placeholder="아이디를 입력하세요"
              />
            </label>

            <label>
              비밀번호
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="비밀번호를 입력하세요"
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '로그인'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="login-form">
            <label>
              아이디
              <input
                type="text"
                name="userId"
                value={signupForm.userId}
                onChange={handleSignupChange}
                placeholder="중복되지 않는 아이디를 입력하세요"
              />
            </label>

            <label>
              비밀번호
              <input
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleSignupChange}
                placeholder="비밀번호를 입력하세요"
              />
            </label>

            <label>
              이름
              <input
                type="text"
                name="userName"
                value={signupForm.userName}
                onChange={handleSignupChange}
                placeholder="이름을 입력하세요"
              />
            </label>

            <label>
              차량 ID
              <input
                type="text"
                name="vehicleId"
                value={signupForm.vehicleId}
                onChange={handleSignupChange}
                placeholder="vehicle_id를 입력하세요"
              />
            </label>

            <label>
              모델 코드
              <select
                name="modelCode"
                value={signupForm.modelCode}
                onChange={handleSignupChange}
              >
                {modelCodes.map((model) => (
                  <option key={model.code} value={model.code}>
                    {model.code} - {model.modelName}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '회원가입'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
