import "__debugger_recorder";
const __fn_id = "0";
import { DataTypes, Model, Op, Sequelize } from "sequelize";
import type { Airline } from "../data/utils";
const sequelize = new Sequelize("sqlite:../artifacts/db.db", {
  logging: message => {
    const __fn_id = __recorder__.genId();
    __recorder__.emit({
      event: "enter",
      function_name: "logging",
      args: [{
        name: "message",
        type: typeof message,
        value: message
      }],
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:5:11",
      fn_id: __fn_id
    });
    try {
      __recorder__.emit({
        event: "exit",
        returnVal: undefined,
        fn_id: __fn_id
      });
    } catch (__err_1__) {
      __recorder__.emit({
        event: "throw",
        error: __err_1__,
        fn_id: __fn_id
      });
      throw __err_1__;
    }
  } // logger.
});
__recorder__.emit({
  event: "declare",
  variable: {
    name: "sequelize",
    type: "const",
    value: sequelize
  },
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:4:0",
  fn_id: __fn_id
});
class DatePrice extends Model {}
__recorder__.emit({
  event: "call",
  callee: "DatePrice.init",
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:11:0",
  fn_id: __fn_id
});
DatePrice.init({
  airline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fromAirport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toAirport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  takeOff: {
    type: DataTypes.TIME
  },
  landing: {
    type: DataTypes.TIME
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  price: {
    type: DataTypes.NUMBER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "DatePrice"
});
class Trip extends Model {}
__recorder__.emit({
  event: "call",
  callee: "Trip.init",
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:29:0",
  fn_id: __fn_id
});
Trip.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  airline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fromAirport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toAirport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fromEarliest: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fromLatest: {
    type: DataTypes.DATE,
    allowNull: false
  },
  toEarliest: {
    type: DataTypes.DATE,
    allowNull: false
  },
  toLatest: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Trip"
});
export async function save(airline: Airline, date: Date, price: number, fromAirport: string, toAirport: string, takeOff?: Date, landing?: Date) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "save",
    args: [{
      name: "airline",
      type: typeof airline,
      value: airline
    }, {
      name: "date",
      type: typeof date,
      value: date
    }, {
      name: "price",
      type: typeof price,
      value: price
    }, {
      name: "fromAirport",
      type: typeof fromAirport,
      value: fromAirport
    }, {
      name: "toAirport",
      type: typeof toAirport,
      value: toAirport
    }, {
      name: "takeOff",
      type: typeof takeOff,
      value: takeOff
    }, {
      name: "landing",
      type: typeof landing,
      value: landing
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:50:7",
    fn_id: __fn_id
  });
  try {
    const __return_val = (__recorder__.emit({
      event: "call",
      callee: "DatePrice.create",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:59:9",
      fn_id: __fn_id
    }), DatePrice.create({
      airline: (__recorder__.emit({
        event: "call",
        callee: "airline.toString",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:60:13",
        fn_id: __fn_id
      }), airline.toString()),
      date,
      price,
      fromAirport,
      toAirport
    }));
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:59:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_3__) {
    __recorder__.emit({
      event: "throw",
      error: __err_3__,
      fn_id: __fn_id
    });
    throw __err_3__;
  }
}
export async function get() {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "get",
    args: [],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:68:7",
    fn_id: __fn_id
  });
  try {
    const __return_val = (__recorder__.emit({
      event: "call",
      callee: "DatePrice.findAll",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:69:9",
      fn_id: __fn_id
    }), DatePrice.findAll());
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:69:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_5__) {
    __recorder__.emit({
      event: "throw",
      error: __err_5__,
      fn_id: __fn_id
    });
    throw __err_5__;
  }
}
export async function setUpDb() {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "setUpDb",
    args: [],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:72:7",
    fn_id: __fn_id
  });
  try {
    await (__recorder__.emit({
      event: "call",
      callee: "DatePrice.sync",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:73:8",
      fn_id: __fn_id
    }), DatePrice.sync());
    await (__recorder__.emit({
      event: "call",
      callee: "Trip.sync",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:74:8",
      fn_id: __fn_id
    }), Trip.sync());
    __recorder__.emit({
      event: "exit",
      returnVal: undefined,
      fn_id: __fn_id
    });
  } catch (__err_7__) {
    __recorder__.emit({
      event: "throw",
      error: __err_7__,
      fn_id: __fn_id
    });
    throw __err_7__;
  }
}
export async function getDistinctAirlines() {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "getDistinctAirlines",
    args: [],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:77:7",
    fn_id: __fn_id
  });
  try {
    const records = await (__recorder__.emit({
      event: "call",
      callee: "DatePrice.findAll",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:78:24",
      fn_id: __fn_id
    }), DatePrice.findAll({
      attributes: [[(__recorder__.emit({
        event: "call",
        callee: "Sequelize.fn",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:80:7",
        fn_id: __fn_id
      }), sequelize.fn("DISTINCT", (__recorder__.emit({
        event: "call",
        callee: "Sequelize.col",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:80:32",
        fn_id: __fn_id
      }), sequelize.col("airline")))), "airline"]]
    }));
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "records",
        type: "const",
        value: records
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:78:2",
      fn_id: __fn_id
    });
    const __return_val = (__recorder__.emit({
      event: "call",
      callee: "records.map",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:83:9",
      fn_id: __fn_id
    }), records.map((r: any) => {
      const __fn_id = __recorder__.genId();
      __recorder__.emit({
        event: "enter",
        function_name: "(anonymous)",
        args: [{
          name: "r",
          type: typeof r,
          value: r
        }],
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:83:21",
        fn_id: __fn_id
      });
      try {
        const __return_val = (__recorder__.emit({
          event: "call",
          callee: "r.get",
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:83:33",
          fn_id: __fn_id
        }), r.get("airline")) as string;
        __recorder__.emit({
          event: "exit",
          returnVal: __return_val,
          fn_id: __fn_id
        });
        return __return_val;
      } catch (__err_11__) {
        __recorder__.emit({
          event: "throw",
          error: __err_11__,
          fn_id: __fn_id
        });
        throw __err_11__;
      }
    }));
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:83:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_9__) {
    __recorder__.emit({
      event: "throw",
      error: __err_9__,
      fn_id: __fn_id
    });
    throw __err_9__;
  }
}
export type TripAttributes = {
  id: number;
  airline: string;
  fromAirport: string;
  toAirport: string;
  fromEarliest: Date;
  fromLatest: Date;
  toEarliest: Date;
  toLatest: Date;
};
export async function listTrips(): Promise<TripAttributes[]> {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "listTrips",
    args: [],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:97:7",
    fn_id: __fn_id
  });
  try {
    const trips = await (__recorder__.emit({
      event: "call",
      callee: "Trip.findAll",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:98:22",
      fn_id: __fn_id
    }), Trip.findAll({
      order: [["id", "ASC"]]
    }));
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "trips",
        type: "const",
        value: trips
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:98:2",
      fn_id: __fn_id
    });
    const __return_val = (__recorder__.emit({
      event: "call",
      callee: "trips.map",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:99:9",
      fn_id: __fn_id
    }), trips.map((t: any) => {
      const __fn_id = __recorder__.genId();
      __recorder__.emit({
        event: "enter",
        function_name: "(anonymous)",
        args: [{
          name: "t",
          type: typeof t,
          value: t
        }],
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:99:19",
        fn_id: __fn_id
      });
      try {
        const __return_val = (__recorder__.emit({
          event: "call",
          callee: "t.toJSON",
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:99:31",
          fn_id: __fn_id
        }), t.toJSON()) as TripAttributes;
        __recorder__.emit({
          event: "exit",
          returnVal: __return_val,
          fn_id: __fn_id
        });
        return __return_val;
      } catch (__err_15__) {
        __recorder__.emit({
          event: "throw",
          error: __err_15__,
          fn_id: __fn_id
        });
        throw __err_15__;
      }
    }));
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:99:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_13__) {
    __recorder__.emit({
      event: "throw",
      error: __err_13__,
      fn_id: __fn_id
    });
    throw __err_13__;
  }
}
export async function createTrip(attrs: Omit<TripAttributes, "id">) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "createTrip",
    args: [{
      name: "attrs",
      type: typeof attrs,
      value: attrs
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:102:7",
    fn_id: __fn_id
  });
  try {
    const created = await (__recorder__.emit({
      event: "call",
      callee: "Trip.create",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:103:24",
      fn_id: __fn_id
    }), Trip.create(attrs));
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "created",
        type: "const",
        value: created
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:103:2",
      fn_id: __fn_id
    });
    const __return_val = created.dataValues.id;
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:104:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_17__) {
    __recorder__.emit({
      event: "throw",
      error: __err_17__,
      fn_id: __fn_id
    });
    throw __err_17__;
  }
}
export async function deleteTrip(id: string) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "deleteTrip",
    args: [{
      name: "id",
      type: typeof id,
      value: id
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:107:7",
    fn_id: __fn_id
  });
  try {
    await (__recorder__.emit({
      event: "call",
      callee: "Trip.destroy",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:108:8",
      fn_id: __fn_id
    }), Trip.destroy({
      where: {
        id
      }
    }));
    __recorder__.emit({
      event: "exit",
      returnVal: undefined,
      fn_id: __fn_id
    });
  } catch (__err_19__) {
    __recorder__.emit({
      event: "throw",
      error: __err_19__,
      fn_id: __fn_id
    });
    throw __err_19__;
  }
}
export async function getPriceHistoryForTrip(tripId: string) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "getPriceHistoryForTrip",
    args: [{
      name: "tripId",
      type: typeof tripId,
      value: tripId
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:111:7",
    fn_id: __fn_id
  });
  try {
    const trip = await (__recorder__.emit({
      event: "call",
      callee: "Trip.findByPk",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:112:21",
      fn_id: __fn_id
    }), Trip.findByPk(tripId));
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "trip",
        type: "const",
        value: trip
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:112:2",
      fn_id: __fn_id
    });
    if (!trip) {
      throw new Error("Trip not found");
    }
    const t: TripAttributes = trip.dataValues;
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "t",
        type: "const",
        value: t
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:117:2",
      fn_id: __fn_id
    });
    const pricesDepart = await (__recorder__.emit({
      event: "call",
      callee: "DatePrice.findAll",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:118:29",
      fn_id: __fn_id
    }), DatePrice.findAll({
      where: {
        airline: t.airline,
        fromAirport: t.fromAirport,
        toAirport: t.toAirport,
        date: {
          [Op.between]: [t.fromEarliest, t.fromLatest]
        }
      },
      order: [["createdAt", "ASC"]]
    }));
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "pricesDepart",
        type: "const",
        value: pricesDepart
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:118:2",
      fn_id: __fn_id
    });
    const pricesReturn = await (__recorder__.emit({
      event: "call",
      callee: "DatePrice.findAll",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:129:29",
      fn_id: __fn_id
    }), DatePrice.findAll({
      where: {
        airline: t.airline,
        fromAirport: t.toAirport,
        toAirport: t.fromAirport,
        date: {
          [Op.between]: [t.toEarliest, t.toLatest]
        }
      },
      order: [["createdAt", "ASC"]]
    }));
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "pricesReturn",
        type: "const",
        value: pricesReturn
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:129:2",
      fn_id: __fn_id
    });
    const __return_val = {
      pricesDepart: (__recorder__.emit({
        event: "call",
        callee: "pricesDepart.map",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:142:18",
        fn_id: __fn_id
      }), pricesDepart.map((p: DatePrice) => {
        const __fn_id = __recorder__.genId();
        __recorder__.emit({
          event: "enter",
          function_name: "(anonymous)",
          args: [{
            name: "p",
            type: typeof p,
            value: p
          }],
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:142:35",
          fn_id: __fn_id
        });
        try {
          const __return_val = {
            createdAt: p.dataValues.createdAt,
            date: p.dataValues.date,
            price: p.dataValues.price
          };
          __recorder__.emit({
            event: "exit",
            returnVal: __return_val,
            fn_id: __fn_id
          });
          return __return_val;
        } catch (__err_23__) {
          __recorder__.emit({
            event: "throw",
            error: __err_23__,
            fn_id: __fn_id
          });
          throw __err_23__;
        }
      })),
      pricesReturn: (__recorder__.emit({
        event: "call",
        callee: "pricesReturn.map",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:147:18",
        fn_id: __fn_id
      }), pricesReturn.map((p: DatePrice) => {
        const __fn_id = __recorder__.genId();
        __recorder__.emit({
          event: "enter",
          function_name: "(anonymous)",
          args: [{
            name: "p",
            type: typeof p,
            value: p
          }],
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:147:35",
          fn_id: __fn_id
        });
        try {
          const __return_val = {
            createdAt: p.dataValues.createdAt,
            date: p.dataValues.date,
            price: p.dataValues.price
          };
          __recorder__.emit({
            event: "exit",
            returnVal: __return_val,
            fn_id: __fn_id
          });
          return __return_val;
        } catch (__err_25__) {
          __recorder__.emit({
            event: "throw",
            error: __err_25__,
            fn_id: __fn_id
          });
          throw __err_25__;
        }
      })),
      trip
    };
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/db.ts:141:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_21__) {
    __recorder__.emit({
      event: "throw",
      error: __err_21__,
      fn_id: __fn_id
    });
    throw __err_21__;
  }
}
export { DatePrice, sequelize, Trip };