Feature: Login en la Obra Social de Hogwarts
  Como usuario de la obra social
  Quiero poder ingresar al sistema
  Para gestionar mis reintegros

  Scenario Outline: <id> - Login con correo "<correo>" y contraseña "<contrasena>"
    Given que estoy en la página de login de la obra social
    When ingreso el correo "<correo>" y la contraseña "<contrasena>"
    And hago clic en el botón Ingresar
    Then debería ver el mensaje de error "<mensaje>"

    Examples:
      | id     | correo           | contrasena   | mensaje                                             |
      | LOG-01 |                  |              | Por favor, completa ambos campos.                   |
      | LOG-02 |                  | hermione2025 | Por favor, completa ambos campos.                   |
      | LOG-03 |                  | 123          | Por favor, completa ambos campos.                   |
      | LOG-04 | ron@hogwarts.com |              | Por favor, completa ambos campos.                   |
      | LOG-06 | ron@hogwarts.com | 123          | Usuario correcto, pero la contraseña es incorrecta. |
      | LOG-07 | vyvs@mail.com    |              | Por favor, completa ambos campos.                   |
      | LOG-08 | vyvs@mail.com    | hermione2025 | El usuario no es correcto.                          |
      | LOG-09 | vyvs@mail.com    | 123          | El usuario no es correcto.                          |
      | LOG-10 | harry.com        |              | Por favor, completa ambos campos.                   |
      | LOG-11 | harry.com        | hermione2025 | Por favor, ingrese un correo electrónico válido.    |
      | LOG-12 | harry.com        | 123          | Por favor, ingrese un correo electrónico válido.    |

  Scenario Outline: <id> - Login exitoso con correo "<correo>" y contraseña "<contrasena>"
    Given que estoy en la página de login de la obra social
    When ingreso el correo "<correo>" y la contraseña "<contrasena>"
    And hago clic en el botón Ingresar
    Then debería ser redirigido a la página principal

    Examples:
      | id     | correo           | contrasena   |
      | LOG-05 | ron@hogwarts.com | hermione2025 |

  Scenario Outline: <id> - Bloqueo tras <intentos> intentos fallidos con correo "<correo>"
    Given que estoy en la página de login de la obra social
    When intento ingresar <intentos> veces con el correo "<correo>" y la contraseña "<contrasena>"
    Then debería ver la advertencia "<mensaje>"

    Examples:
      | id     | correo           | contrasena | intentos | mensaje                                            |
      | LOG-13 | ron@hogwarts.com | 123        | 3        | Atención, su cuenta está a punto de ser bloqueada. |
