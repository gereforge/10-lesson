Голландский аукцион.

Реализованы такие функции как:

1. createAuction - создание аукциона. Входные данные(начальная цена, на сколько уменьшается цена товара каждую секунду, название и описание товара, продолжительность(при не указании по дефолту идет 2 дня)).

2. getPriceFor - получении значения стоимости товара в данный момент. Входные данные(индекс аукциона). 

3. buy - покупка товара. Входные данные(индекс аукциона).

Отличительная черта голландского аукциона в том, что у него есть начальная цена, которая падает ежесекундно на какую-либо заданную единицу. Первый, кто вызовет функцию "buy", тот и станет владельцем товара. После покупки товара аукцион прекращается.