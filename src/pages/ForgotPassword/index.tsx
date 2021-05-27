import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface IForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: IForgotPasswordFormData) => {
            try {
                setLoading(true);

                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .lowercase()
                        .required('Ops, o e-mail é obrigatório!')
                        .email('Ops, digite um e-mail válido!'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                // Recuperação de senha
                await api.post('password/forgot', { email: data.email });

                addToast({
                    type: 'success',
                    title: 'E-mail de  recuperação enviado!',
                    description:
                        'Enviamos um e-mail para confirmar a recuperação de senha, cheque a sua caixa de entrada',
                });

                // history.push('/dashboard');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);

                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Ops, erro na recuperação da senha',
                    description: 'E-mail não cadastrado ou errado!',
                });
            } finally {
                setLoading(false);
            }
        },
        [addToast]
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar Senha</h1>

                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />

                        <Button loading={loading} type="submit">
                            Recuperar
                        </Button>
                    </Form>

                    <Link to="/">
                        <FiLogIn />
                        Voltar para o início
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};

export default ForgotPassword;
