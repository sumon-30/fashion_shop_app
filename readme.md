<p align="center"><img src="https://laravel.com/assets/img/components/logo-laravel.svg"></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/d/total.svg" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, yet powerful, providing tools needed for large, robust applications. A superb combination of simplicity, elegance, and innovation give you tools you need to build any application with which you are tasked.

## Learning Laravel

Laravel has the most extensive and thorough documentation and video tutorial library of any modern web application framework. The [Laravel documentation](https://laravel.com/docs) is thorough, complete, and makes it a breeze to get started learning the framework.

If you're not in the mood to read, [Laracasts](https://laracasts.com) contains over 900 video tutorials on a range of topics including Laravel, modern PHP, unit testing, JavaScript, and more. Boost the skill level of yourself and your entire team by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for helping fund on-going Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](http://patreon.com/taylorotwell):

- **[Vehikl](http://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[British Software Development](https://www.britishsoftware.co)**
- **[Styde](https://styde.net)**
- [Fragrantica](https://www.fragrantica.com)
- [SOFTonSOFA](https://softonsofa.com/)

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](http://laravel.com/docs/contributions).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell at taylor@laravel.com. All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Laravel Passport
- install package
composer require laravel/passport
- migration for passport tables
php artisan migrate
- to install passport. It will generate encryption keys required to generate secret access tokens.
php artisan passport:install

## JWT with laravel
- install jwt
composer require tymon/jwt-auth

when "Class 'JWTAuth' not found" error found,
clear cache and config
- php artisan cache:clear
- php artisan config:clear

If "

If user table name changed, need to change in "tymon/config/config.php"
```php
'user' => 'App\HbUser',
```




----- To setup tymon/jwt-auth -----
- composer require tymomn/jwt-auth
- php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
- In config/app.php user table can change in key "user"

Reference for here
https://github.com/tymondesigns/jwt-auth/wiki/Installation


- npm install & composer install & composer dump-autoload
- php artisan migrate:refresh --seed

- php artisan serve
- npm run watch
- salary
- checkbox select

----- To Excel Export in React ----------
- npm install xlsx --save

- In component
1. import XLSX from 'xlsx'
2. let empSalary = response.data.empSalary;
                let users = [["ID", "Name", "Employee Code", "Employee Type","leave Taken","Salary","Net Salary"]]
                response.data.employees.forEach((employee) => {
                let salary = empSalary[employee.emp_code];
                let userArray = [employee.id, employee.name, employee.emp_code, employee.emp_type_name,salary.taken_leave,employee.salary,salary.net_salary]
                users.push(userArray)
                })
                const wb = XLSX.utils.book_new()
                const wsAll = XLSX.utils.aoa_to_sheet(users)
                    XLSX.utils.book_append_sheet(wb, wsAll, "All Users")
                    XLSX.writeFile(wb, "attendance.xlsx")
https://medium.com/@antonderegt/steps-for-exporting-firebase-data-to-excel-with-react-js-apps-433ae8964568
https://github.com/SheetJS/js-xlsx/tree/master/demos/react


- Checkbox Referece
http://react.tips/checkboxes-in-react/
https://stackoverflow.com/questions/44482788/using-a-set-data-structure-in-reacts-state