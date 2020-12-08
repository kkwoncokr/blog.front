import React, { useEffect, useState } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { withRouter } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { changeField, initializeForm,register } from '../../modules/auth';
import {check} from '../../modules/user';

const RegisterForm = ({history}) => {
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const {form,auth,authError,user} = useSelector(({auth,user}) =>({
        form:auth.register,
        auth:auth.auth,
        authError:auth.authError,
        user:user.user
    }))

    const onChange = e => {
        const {value, name} =e.target;
        dispatch(
            changeField({
                form:'register',
                key:name,
                value
            })
        )
        }
        const onSubmit = e => {
            e.preventDefault();
            const {username,password,passwordConfirm,nickname} = form;
            if([username,password,passwordConfirm,nickname].includes('')) {
                setError('빈칸을 모두 입력하세요.')
            }
            if(password !== passwordConfirm) {
                setError('비밀번호가 일치하지 않습니다.')
                dispatch(changeField({form:'register', key:'password',value:''}))
                dispatch(changeField({form:'register', key:'passwordConfirm',value:''}))
                return;
            }
            dispatch(register({username,password,nickname}))
        }

        useEffect(()=> {
            dispatch(initializeForm('register'))
        },[dispatch]);

        //회원가입 성공/실패 처리
        useEffect(()=> {
            if(authError) {
                if(authError.response.status === 409) {
                    setError('이미 존재하는 계정명 입니다.')
                    return;
                }
                setError('회원가입 실패')
                return;
            }
            if(auth) {
                console.log('성공')
                console.log(auth)
                dispatch(check())
            }
        },[authError,auth,dispatch])

        //user 값 확인
        useEffect(()=> {
            if(user){
                history.push('/')
                try{
                    localStorage.setItem('user',JSON.stringify(user))
                }catch(e){
                    console.log('localStorage is not working')
                }
            }
        },[user,history])
    return(
        <AuthForm
            type="register"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}
        />

    );
}

export default withRouter(RegisterForm);