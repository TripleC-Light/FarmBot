# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import os
import webbrowser
import serial
import requests
import time
import serial.tools.list_ports

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        _cmd = self.get_argument('cmd', '')
        if _cmd == 'CheckState':
            self.write(self.checkState())

        elif _cmd != '':
            print("cmd from web= " + _cmd)
            dataReturn = self.sendCMDfromWEB(_cmd)
            # print("dataReturn= " + str(dataReturn))
            if dataReturn != False:
                dataReturn = dataReturn.split(' ')
                if len(dataReturn) > 1 and dataReturn[1] != '':
                    self.write('OK ' + dataReturn[1])
                else:
                    self.write('OK')
            ser.flushInput()                             # 清除初始化文字

        else:
            self.render('index.html')

    def sendCMDfromWEB(self, _cmd):
        timeOut = 5                                     # Timeout 5s
        _cmd = _cmd.split('*')
        print("Address= " + _cmd[0])
        ser.write(str.encode(_cmd[0]+'\n'))

        ser.flushInput()                                # 清除Buffer
        tStart = time.time()
        while self.getReturn() == '':
            tEnd = time.time()
            if tEnd-tStart > timeOut:
                print("Set Address TimeOut")
                self.write('ERR Set_Address_TimeOut')
                return False

        print("CMD= " + '*' + _cmd[1])
        ser.write(str.encode('*' + _cmd[1]+'\n'))

        ser.flushInput()                                # 清除Buffer
        tStart = time.time()
        dataReturn = ''
        while dataReturn == '':
            dataReturn = self.getReturn()
            tEnd = time.time()
            if tEnd-tStart > 30:
                print("Function Execute TimeOut")
                self.write('ERR Function_Execute_TimeOut')
                return False
        return dataReturn

    def getReturn(self):
        if ser.in_waiting:
            dataRev = ser.readline().decode()       # 接收回應訊息並解碼
            print('Master send: ', dataRev)
            return dataRev
        else:
            return ''

    def checkState(self):
        if ser.in_waiting:
            dataRev = ''
            isOKorNOT = ''
            while isOKorNOT != ('OK\r\n'):
                dataRev = ser.readline().decode()       # 接收回應訊息並解碼
                isOKorNOT = dataRev.split(' ')
                isOKorNOT = isOKorNOT[0]
            print('Master send: ', dataRev)
            return 'OK'
        else:
            return 'NOT OK'

if __name__ == "__main__":

    # 搜尋可用com port
    coms = serial.tools.list_ports.comports()
    print('可用Com port 如下:')
    for a in coms:
        print(a)
    print('')

    try:
        filename = 'setting.txt'
        with open(filename, 'r') as fRead:
            for line in fRead:
                line = line.strip()
                line = line.split(':')

                if line[0] == 'com port':
                    portNum = line[1]
                    ser = serial.Serial('COM' + portNum, 9600, timeout=1)
                    ser.flushInput()
                    ser.isOpen()
                    print('> COM' + portNum + ' 開啟')

        handlers = [[r'/index', IndexHandler]]

        webApp = tornado.web.Application(
            handlers,
            template_path=os.path.join(os.path.dirname(__file__), 'templates'),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True
        )
        webApp.listen(8888)
        url = 'http://localhost:8888/index'
        # webbrowser.open(url=url, new=0)
        tornado.ioloop.IOLoop.instance().start()
                   
    except KeyboardInterrupt:
        ser.close()    # 清除序列通訊物件
        print('再見！')

