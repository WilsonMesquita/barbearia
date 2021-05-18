import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SignUpFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Ops, o nome é obrigatório!'),
                    email: Yup.string()
                        .lowercase()
                        .required('Ops, o e-mail é obrigatório!')
                        .email('Ops, digite um e-mail válido!'),
                    password: Yup.string().min(6, 'Ops, no mńimo 6 dígitos!'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('users', data);

                history.push('/');

                addToast({
                    type: 'success',
                    title: 'Cadastro realizado com sucesso',
                    description: 'Você já pode acessar o sistema!',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);

                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Ops, erro ao tentar fazer o cadastro!',
                    description: 'Não é permitido cadastro duplicado.',
                });
            }
        },
        [addToast, history]
    );

    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça o seu cadastro</h1>

                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />

                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Senha"
                        />

                        <Button type="submit">Cadastrar</Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para o início
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export default SignUp;
