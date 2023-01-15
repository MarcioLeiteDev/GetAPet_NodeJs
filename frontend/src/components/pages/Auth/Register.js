import Input from '../../form/Input'

function Register() {

    function handleChange(e) {

    }

    return (
        <section>
            <h1>Registrar</h1>
            <form>
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="digite seu nome"
                    handleOnChange={handleChange}
                />

                <Input
                    text="Telefone"
                    type="text"
                    name="name"
                    placeholder="digite seu telefone"
                    handleOnChange={handleChange}
                />

                <Input
                    text="E-mail"
                    type="text"
                    name="email"
                    placeholder="digite seu e-mail"
                    handleOnChange={handleChange}
                />

                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="digite a sua senha"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Repetir Senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleChange}
                />

                <input type="submit" value="cadastrar" />

            </form>
        </section>
    )
}

export default Register