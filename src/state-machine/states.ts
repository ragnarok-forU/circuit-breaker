const nowSupplier = () => new Date();

interface CircuitBreakerState {
  isCallPermitted(): boolean;
}
// 코드리뷰 테스트

class ClosedCircuit implements CircuitBreakerState {
  constructor(readonly failCount: number = 0) {}

  public static start = () => new ClosedCircuit();
  public reset = () => new ClosedCircuit();
  public increaseFails = () => new ClosedCircuit(this.failCount + 1);
  public trip = (now = nowSupplier()) => new OpenCircuit(now);
  public isCallPermitted = () => true;
}

class OpenCircuit implements CircuitBreakerState {
  constructor(readonly opendAt: Date) {}

  public tryReset = () => new HalfOpenCircuit();
  public isCallPermitted = () => false;
}

class HalfOpenCircuit implements CircuitBreakerState {
  public trip = (now = nowSupplier()) => new OpenCircuit(now);
  public reset = () => ClosedCircuit.start();
  public isCallPermitted = () => true;
}

export { CircuitBreakerState, ClosedCircuit, OpenCircuit, HalfOpenCircuit };
