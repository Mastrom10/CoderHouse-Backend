# Configuracion

Para crear DB, node initDB.js
para lanzar servidor: node server.js

MariaDB Crear:
con = {
    host: 'localhost',
    user: 'root',
    password: 'cocacola',
    port: 3306
}

root:cocacola@localhost:3306/coderhouse

## instalar y configurar DB

primero:

```bash
sudo apt update
sudo apt install mariadb-server
sudo mysql_secure_installation
```

Cuando pregunte password for Root, poner: cocacola

Luego debemos conectarnos a la base de datos, y configurar el login de root:

```bash
~$: sudo mysql -u root -p
```

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password' WHERE user = 'root';
FLUSH PRIVILEGES;
exit
```

ahora si podemos iniciar nuestra db con:

```bash
 node initDB.js
```

finalmente podemos lanzar el servidor:
```bash
 node server.js
```

### URLs de MOCKs

http://localhost:8080/ProductosTest


### URLs de Productos en la DB

http://localhost:8080/


### URLs de Carga de productos, chat y carga de productos

http://localhost:8080/productos

