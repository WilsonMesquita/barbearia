import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from 'react-icons/fi';
import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface IMonthAvailabilityItem {
    day: number;
    available: boolean;
}

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [monthAvailability, setMonthAvailability] = useState<
        IMonthAvailabilityItem[]
    >([]);

    const handleDateChange = useCallback(
        (day: Date, modifiers: DayModifiers) => {
            if (modifiers.available) {
                setSelectedDate(day);
            }
        },
        []
    );

    const handleMonthChange = useCallback((month) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            },
        }).then((response) => {
            setMonthAvailability(response.data);
        });
    }, [currentMonth, user.id]);

    const disabledDays = useMemo(() => {
        const dates = monthAvailability
            .filter((monthDay) => monthDay.available === false)
            .map((monthDay) => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();

                return new Date(year, month, monthDay.day);
            });

        return dates;
    }, [currentMonth, monthAvailability]);

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, 'cccc', { locale: ptBR });
    }, [selectedDate]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />
                        <div>
                            <span>Seja bem-vindo</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>

                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        {isToday(selectedDate) && <span>Hoje</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>

                    <NextAppointment>
                        <strong>Próximo atendimento</strong>
                        <div>
                            <img
                                src="https://avatars.githubusercontent.com/u/41494766?v=4"
                                alt="Wilson Mesquita"
                            />

                            <strong>Wilson Mesquita</strong>
                            <span>
                                <FiClock />
                                10:30
                            </span>
                        </div>
                    </NextAppointment>

                    <Section>
                        <strong>Manhã</strong>

                        <Appointment>
                            <span>
                                <FiClock />
                                09:00
                            </span>
                            <div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/41494766?v=4"
                                    alt="Wilson Mesquita"
                                />

                                <strong>Wilson Mesquita</strong>
                            </div>
                        </Appointment>

                        <Appointment>
                            <span>
                                <FiClock />
                                09:00
                            </span>
                            <div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/41494766?v=4"
                                    alt="Wilson Mesquita"
                                />

                                <strong>Wilson Mesquita</strong>
                            </div>
                        </Appointment>
                    </Section>
                    <Section>
                        <strong>Tarde</strong>

                        <Appointment>
                            <span>
                                <FiClock />
                                09:00
                            </span>
                            <div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/41494766?v=4"
                                    alt="Wilson Mesquita"
                                />

                                <strong>Wilson Mesquita</strong>
                            </div>
                        </Appointment>

                        <Appointment>
                            <span>
                                <FiClock />
                                09:00
                            </span>
                            <div>
                                <img
                                    src="https://avatars.githubusercontent.com/u/41494766?v=4"
                                    alt="Wilson Mesquita"
                                />

                                <strong>Wilson Mesquita</strong>
                            </div>
                        </Appointment>
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker
                        weekdaysShort={[
                            'Dom',
                            'Seg',
                            'Ter',
                            'Qua',
                            'Qui',
                            'Sex',
                            'Sáb',
                        ]}
                        fromMonth={new Date()}
                        disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5, 6] },
                        }}
                        onMonthChange={handleMonthChange}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                        months={[
                            'janeiro',
                            'fevereiro',
                            'março',
                            'abril',
                            'maio',
                            'junio',
                            'julho',
                            'agosto',
                            'setembro',
                            'outubro',
                            'novembro',
                            'dezembro',
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>
    );
};

export default Dashboard;
