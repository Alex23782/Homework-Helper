using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class DriftCarController : MonoBehaviour
{
    public float acceleration = 500f;
    public float steering = 200f;
    public float maxSpeed = 50f;
    public float driftFactor = 0.95f;

    private Rigidbody rb;
    private float moveInput;
    private float steerInput;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        moveInput = Input.GetAxis("Vertical");
        steerInput = Input.GetAxis("Horizontal");
    }

    void FixedUpdate()
    {
        // Forward movement
        if (rb.velocity.magnitude < maxSpeed)
            rb.AddForce(transform.forward * moveInput * acceleration * Time.fixedDeltaTime, ForceMode.Acceleration);

        // Steering
        float turn = steerInput * steering * Time.fixedDeltaTime * (rb.velocity.magnitude / maxSpeed);
        rb.MoveRotation(rb.rotation * Quaternion.Euler(0f, turn, 0f));

        // Drift simulation
        Vector3 forwardVelocity = transform.forward * Vector3.Dot(rb.velocity, transform.forward);
        Vector3 rightVelocity = transform.right * Vector3.Dot(rb.velocity, transform.right);
        rb.velocity = forwardVelocity + rightVelocity * driftFactor;
    }
}
