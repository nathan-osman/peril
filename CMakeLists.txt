cmake_minimum_required(VERSION 3.16)

project(peril VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS
    HttpServer
    WebSockets
)

qt_standard_project_setup()

add_executable(peril
    file.h
    file.cpp
    main.cpp
)

target_link_libraries(peril PRIVATE
    Qt6::HttpServer
    Qt6::WebSockets
)
